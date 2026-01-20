using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using AlvaresWeb.Core.Models;

namespace AlvaresWeb.Infrastructure.Persistence;

public partial class SqlContext(IConfiguration configuration, DbContextOptions<SqlContext> options)
    : DbContext(options)
{
    private readonly string _connectionString = configuration.GetConnectionString("PostgresConnection") 
        ?? throw new ArgumentNullException(nameof(configuration), "Connection string 'PostgresConnection' not found.");

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Chat> Chats { get; set; }
    public virtual DbSet<UserChat> UserChats { get; set; }
    public virtual DbSet<UserSession> UserSessions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Npgsql for Postgres connection
        optionsBuilder.UseNpgsql(_connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.id).HasName("user_pk");
            entity.ToTable("users");

            entity.HasIndex(e => e.telegram_id).IsUnique();

            entity.Property(e => e.telegram_id).IsRequired();
            entity.Property(e => e.first_name).HasMaxLength(255).IsRequired();
            entity.Property(e => e.username).HasMaxLength(255);
            entity.Property(u => u.role).HasConversion<string>();
            entity.Property(e => e.registered_at).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<Chat>(entity =>
        {
            entity.HasKey(e => e.id).HasName("chat_pk");
            entity.ToTable("chats");

            entity.HasIndex(e => e.telegram_chat_id).IsUnique();
            entity.Property(e => e.created_at).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<UserChat>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.ChatId }).HasName("user_chat_pk");
            entity.ToTable("user_chats");

            entity.HasOne(d => d.User)
                .WithMany(p => p.UserChats)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Chat)
                .WithMany(p => p.UserChats)
                .HasForeignKey(d => d.ChatId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserSession>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("session_pk");
            entity.ToTable("user_sessions");

            entity.HasIndex(e => e.SessionToken).IsUnique();

            entity.HasOne(d => d.User)
                .WithMany(p => p.Sessions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}